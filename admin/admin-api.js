/**
 * 관리자 API — 로컬(Vite `/__admin/api`) 또는 배포(GitHub Contents API)
 * 브라우저에서 `<script type="module">` 로 로드.
 */

const TOKEN_KEY = "todays-hotdeal-admin-gh-token";

/** @type {'unknown' | 'local' | 'github'} */
let mode = "unknown";

function config() {
  const c = window.__ADMIN_CONFIG__ || {};
  return {
    owner: c.github?.owner || "seungjinpark123",
    repo: c.github?.repo || "Jenniespark",
    branch: c.github?.branch || "main",
    categories: Array.isArray(c.categories) ? c.categories : [],
  };
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  const t = String(token || "").trim();
  if (t) {
    sessionStorage.setItem(TOKEN_KEY, t);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

/**
 * @returns {Promise<'local' | 'github'>}
 */
export async function detectMode() {
  if (mode !== "unknown") {
    return mode;
  }
  try {
    const r = await fetch("/__admin/api/meta", { method: "GET" });
    if (r.ok) {
      mode = "local";
      return mode;
    }
  } catch {
    /* ignore */
  }
  mode = "github";
  return mode;
}

function yamlScalar(value) {
  const s = String(value ?? "");
  if (s === "") {
    return '""';
  }
  if (/[\n\r:#{}[\],&*?|>!%@`'"]/.test(s) || /^\s|\s$/.test(s) || /^(true|false|null|~)$/i.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

/**
 * @param {{ title: string; date: string; category: string; excerpt: string; dealUrl?: string; html: string }} p
 */
export function buildPostMarkdown(p) {
  const lines = [
    "---",
    `title: ${yamlScalar(p.title)}`,
    `date: ${p.date}`,
    `category: ${p.category}`,
    `excerpt: ${yamlScalar(p.excerpt)}`,
  ];
  if (p.dealUrl) {
    lines.push(`dealUrl: ${yamlScalar(p.dealUrl)}`);
  }
  lines.push("format: html", "related: []", "---", "", String(p.html || "").trim(), "");
  return lines.join("\n");
}

function validatePostInput(payload) {
  const title = String(payload.title || "").trim();
  const date = String(payload.date || "").trim();
  const category = String(payload.category || "").trim();
  const excerpt = String(payload.excerpt || "").trim();
  const dealUrl = String(payload.dealUrl || "").trim();
  const html = String(payload.html || "").trim();
  if (!title || !date || !category || !excerpt || !html) {
    throw new Error("title, date, category, excerpt, 본문을 모두 채워 주세요.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("date 는 YYYY-MM-DD 형식이어야 합니다.");
  }
  if (html.includes("\n---\n") || html.startsWith("---")) {
    throw new Error("본문에 `---` 줄(프론트매터 구분)을 넣을 수 없습니다.");
  }
  if (dealUrl && !/^https?:\/\//i.test(dealUrl)) {
    throw new Error("dealUrl 은 http(s):// 로 시작하는 URL이어야 합니다.");
  }
  return { title, date, category, excerpt, dealUrl, html };
}

function b64EncodeUtf8(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
}

function b64DecodeUtf8(b64) {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function ghFetch(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("GitHub 토큰이 없습니다. 먼저 로그인하세요.");
  }
  const { owner, repo } = config();
  const url = path.startsWith("https://")
    ? path
    : `https://api.github.com/repos/${owner}/${repo}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    throw new Error(data.message || res.statusText || `GitHub API ${res.status}`);
  }
  return data;
}

async function listPostFiles() {
  const { branch } = config();
  try {
    const data = await ghFetch(`/contents/posts?ref=${encodeURIComponent(branch)}`);
    if (!Array.isArray(data)) {
      return [];
    }
    return data
      .filter((x) => x.type === "file" && /^\d+\.md$/i.test(x.name))
      .map((x) => ({
        name: x.name,
        fileNum: parseInt(x.name, 10),
        path: x.path,
        sha: x.sha,
      }))
      .sort((a, b) => a.fileNum - b.fileNum);
  } catch (e) {
    if (String(e.message || e).includes("Not Found")) {
      return [];
    }
    throw e;
  }
}

function parseFrontMatter(raw) {
  const m = String(raw || "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    return { data: {}, content: String(raw || "") };
  }
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      try {
        val = JSON.parse(val.replace(/^'/, '"').replace(/'$/, '"'));
      } catch {
        val = val.slice(1, -1);
      }
    }
    data[key] = val;
  }
  return { data, content: m[2].replace(/^\n/, "") };
}

async function putFile(path, contentText, message, sha) {
  const { branch } = config();
  const body = {
    message,
    content: b64EncodeUtf8(contentText),
    branch,
  };
  if (sha) {
    body.sha = sha;
  }
  return ghFetch(`/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function deleteFile(path, sha, message) {
  const { branch } = config();
  return ghFetch(`/contents/${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch }),
  });
}

async function getFile(path) {
  const { branch } = config();
  return ghFetch(`/contents/${path}?ref=${encodeURIComponent(branch)}`);
}

/** 로컬 API */
async function localJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || res.statusText || "요청 실패");
  }
  return data;
}

export async function getMeta() {
  const m = await detectMode();
  if (m === "local") {
    return localJson("/__admin/api/meta");
  }
  return { categories: config().categories };
}

export async function listPosts() {
  const m = await detectMode();
  if (m === "local") {
    return localJson("/__admin/api/posts");
  }
  const files = await listPostFiles();
  const posts = [];
  for (const f of files) {
    const file = await getFile(f.path);
    const raw = b64DecodeUtf8(file.content.replace(/\n/g, ""));
    const { data } = parseFrontMatter(raw);
    posts.push({
      fileNum: f.fileNum,
      title: data.title || `딜 ${f.fileNum}`,
      date: String(data.date || "").slice(0, 10),
      category: data.category || "",
      editable: String(data.format || "").toLowerCase() === "html",
    });
  }
  posts.sort((a, b) => b.fileNum - a.fileNum);
  return { posts };
}

export async function loadPost(fileNum) {
  const m = await detectMode();
  if (m === "local") {
    return localJson(`/__admin/api/post/${fileNum}`);
  }
  const n = Number(fileNum);
  const file = await getFile(`posts/${n}.md`);
  const raw = b64DecodeUtf8(file.content.replace(/\n/g, ""));
  const { data, content } = parseFrontMatter(raw);
  if (String(data.format || "").toLowerCase() !== "html") {
    throw new Error("HTML 형식(format: html) 글만 수정할 수 있습니다.");
  }
  return {
    ok: true,
    post: {
      fileNum: n,
      relPath: `posts/${n}.md`,
      title: data.title || "",
      date: String(data.date || "").slice(0, 10),
      category: data.category || "",
      excerpt: data.excerpt || "",
      dealUrl: data.dealUrl || data.link || "",
      html: content.trim(),
      sha: file.sha,
    },
  };
}

export async function savePost(payload) {
  const m = await detectMode();
  const body = validatePostInput(payload);
  if (m === "local") {
    return localJson("/__admin/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  const files = await listPostFiles();
  const max = files.reduce((acc, f) => Math.max(acc, f.fileNum), 0);
  const fileNum = max + 1;
  const relPath = `posts/${fileNum}.md`;
  const md = buildPostMarkdown(body);
  await putFile(relPath, md, `admin: add ${relPath}`);
  return {
    ok: true,
    fileNum,
    relPath,
    notice: "소스 저장소에 커밋했습니다. GitHub Actions 배포가 끝나면 사이트에 반영됩니다.",
  };
}

export async function updatePost(payload) {
  const m = await detectMode();
  const fileNum = parseInt(String(payload.fileNum || ""), 10);
  const body = validatePostInput(payload);
  if (m === "local") {
    return localJson("/__admin/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileNum, ...body }),
    });
  }
  if (!Number.isInteger(fileNum) || fileNum < 1) {
    throw new Error("fileNum 이 올바르지 않습니다.");
  }
  const relPath = `posts/${fileNum}.md`;
  const existing = await getFile(relPath);
  const md = buildPostMarkdown(body);
  await putFile(relPath, md, `admin: update ${relPath}`, existing.sha);
  return {
    ok: true,
    fileNum,
    relPath,
    notice: "소스 저장소에 커밋했습니다. GitHub Actions 배포가 끝나면 사이트에 반영됩니다.",
  };
}

export async function deletePost(fileNum) {
  const m = await detectMode();
  const n = parseInt(String(fileNum || ""), 10);
  if (m === "local") {
    return localJson("/__admin/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileNum: n }),
    });
  }
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("fileNum 이 올바르지 않습니다.");
  }
  const relPath = `posts/${n}.md`;
  const existing = await getFile(relPath);
  await deleteFile(relPath, existing.sha, `admin: delete ${relPath}`);
  return {
    ok: true,
    fileNum: n,
    relPath,
    notice: "소스 저장소에서 삭제했습니다. 배포가 끝나면 사이트에 반영됩니다.",
  };
}

export async function uploadImage(file) {
  const m = await detectMode();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("이미지 파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });

  if (m === "local") {
    const data = await localJson("/__admin/api/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, dataUrl }),
    });
    return data.url;
  }

  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|gif|webp));base64,([a-z0-9+/=]+)$/i);
  if (!match) {
    throw new Error("지원하지 않는 이미지 형식입니다. PNG/JPG/GIF/WEBP만 가능합니다.");
  }
  const mime = match[1].toLowerCase();
  const extMap = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  const ext = extMap[mime];
  if (!ext) {
    throw new Error("지원하지 않는 이미지 형식입니다.");
  }
  const binary = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
  if (binary.length > 5 * 1024 * 1024) {
    throw new Error("이미지 파일은 5MB 이하만 업로드할 수 있습니다.");
  }
  const stem = String(file.name || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
    .toLowerCase() || "image";
  const outName = `${Date.now()}-${stem}.${ext}`;
  const path = `public/uploads/admin/${outName}`;
  const { branch } = config();
  await ghFetch(`/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `admin: upload ${path}`,
      content: match[2],
      branch,
    }),
  });
  return `/uploads/admin/${outName}`;
}
