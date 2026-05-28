import { jsxs, jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
const SITE_NAME = "Jenniespark";
const SITE_TAGLINE = "금융 부동산 정책 IT 정보부터 맛집 트렌드 육아 지식까지 다양한 최신 꿀팁을 정리합니다.";
const FOOTER_COPYRIGHT = "© Jenniespark";
const CATEGORY_ORDER = [
  "dev",
  "it",
  "parenting",
  "trend",
  "knowledge",
  "finance",
  "realestate",
  "food",
  "book"
];
const CATEGORY_LABELS = {
  dev: "개발",
  it: "IT",
  parenting: "육아",
  trend: "트렌드",
  knowledge: "지식",
  finance: "금융",
  realestate: "부동산",
  food: "맛집",
  book: "도서"
};
function SiteFooter({ rootPrefix = "" }) {
  return /* @__PURE__ */ jsxs("footer", { className: "siteFooter", role: "contentinfo", children: [
    /* @__PURE__ */ jsxs("nav", { className: "siteFooter__nav", "aria-label": "약관·문의", children: [
      /* @__PURE__ */ jsx("a", { href: `${rootPrefix}privacy/`, className: "siteFooter__link", children: "개인정보처리방침" }),
      /* @__PURE__ */ jsx("span", { className: "siteFooter__sep", "aria-hidden": "true", children: "·" }),
      /* @__PURE__ */ jsx("a", { href: `${rootPrefix}terms/`, className: "siteFooter__link", children: "이용약관" }),
      /* @__PURE__ */ jsx("span", { className: "siteFooter__sep", "aria-hidden": "true", children: "·" }),
      /* @__PURE__ */ jsx("a", { href: `${rootPrefix}contact/`, className: "siteFooter__link", children: "문의" }),
      /* @__PURE__ */ jsx("span", { className: "siteFooter__sep", "aria-hidden": "true", children: "·" }),
      /* @__PURE__ */ jsx("a", { href: `${rootPrefix}about/`, className: "siteFooter__link", children: "소개" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "siteFooter__text", children: FOOTER_COPYRIGHT })
  ] });
}
function SiteHeader({ rootPrefix, active }) {
  const home = rootPrefix ? rootPrefix : "./";
  return /* @__PURE__ */ jsx("header", { className: "siteHeader", role: "banner", children: /* @__PURE__ */ jsx("div", { className: "siteHeader__inner", children: /* @__PURE__ */ jsx(
    "a",
    {
      href: home,
      className: "siteHeader__brand",
      "aria-current": active === "home" ? "page" : void 0,
      children: "Jenniespark"
    }
  ) }) });
}
function SiteSidebar({ rootPrefix, active }) {
  const home = rootPrefix ? rootPrefix : "./";
  return /* @__PURE__ */ jsx("aside", { className: "siteSidebar", "aria-label": "사이트·카테고리", children: /* @__PURE__ */ jsxs("nav", { className: "sideNav", "aria-label": "사이트 메뉴", children: [
    /* @__PURE__ */ jsx("p", { className: "sideNav__sectionLabel", children: "사이트" }),
    /* @__PURE__ */ jsx("ul", { className: "sideNav__list", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      "a",
      {
        href: home,
        className: `sideNav__link ${active === "home" ? "sideNav__link--active" : ""}`,
        "aria-current": active === "home" ? "page" : void 0,
        children: "홈"
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "sideNav__separator", role: "separator", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("p", { className: "sideNav__sectionLabel", children: "카테고리" }),
    /* @__PURE__ */ jsx("ul", { className: "sideNav__list", children: CATEGORY_ORDER.map((cat) => {
      const href = `${rootPrefix}${cat}/`;
      const act = `category-${cat}`;
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href,
          className: `sideNav__link ${active === act ? "sideNav__link--active" : ""}`,
          "aria-current": active === act ? "page" : void 0,
          children: CATEGORY_LABELS[cat]
        }
      ) }, cat);
    }) })
  ] }) });
}
function SiteLayout({ children, rootPrefix, active }) {
  return /* @__PURE__ */ jsxs("div", { className: "siteLayout", id: "top", children: [
    /* @__PURE__ */ jsx(SiteHeader, { rootPrefix, active }),
    /* @__PURE__ */ jsxs("div", { className: "siteLayout__body", children: [
      /* @__PURE__ */ jsx(SiteSidebar, { rootPrefix, active }),
      /* @__PURE__ */ jsx("div", { className: "siteLayout__main", children: /* @__PURE__ */ jsx("main", { className: "siteLayout__content", children }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, { rootPrefix })
  ] });
}
function rootPrefixFromDepth(depth) {
  if (depth <= 0) {
    return "";
  }
  return "../".repeat(depth);
}
function homeDirHrefFromDepth(depth) {
  if (depth <= 0) {
    return "./";
  }
  return rootPrefixFromDepth(depth);
}
function postListHrefFromDepth(depth, fileNum) {
  return `${rootPrefixFromDepth(depth)}posts/${fileNum}/`;
}
function HomePage({ page }) {
  const { data, active, depth } = page;
  const r = rootPrefixFromDepth(depth);
  const posts = [...data.posts || []].sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
    /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "home-title", children: [
      /* @__PURE__ */ jsx("h1", { id: "home-title", className: "page__h1", children: data.siteName ?? SITE_NAME }),
      /* @__PURE__ */ jsx("p", { className: "page__meta", children: data.tagline ?? SITE_TAGLINE })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page__section page__section--posts", "aria-labelledby": "posts-heading", children: [
      /* @__PURE__ */ jsx("h2", { id: "posts-heading", className: "page__h2 page__h2--section", children: "최근 글" }),
      /* @__PURE__ */ jsxs("div", { className: "page__search js-search-scope", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "page__searchInput js-post-search-input",
            type: "search",
            placeholder: "키워드를 검색하세요",
            "aria-label": "글 검색"
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "page__searchMeta js-post-search-meta", children: [
          "전체 ",
          posts.length,
          "건"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "page__listShell", children: [
        /* @__PURE__ */ jsx("div", { className: "postList js-post-search-list", children: posts.map((post) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "postCard js-post-search-item",
            "data-search-text": `${String(post.title || "").toLowerCase()} ${String(post.excerpt || "").toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsx("p", { className: "postCard__date", children: /* @__PURE__ */ jsx("time", { dateTime: post.date, children: post.date }) }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  className: "postCard__linkBlock",
                  href: postListHrefFromDepth(depth, post.fileNum),
                  "aria-label": `${post.title} 글 보기`,
                  children: [
                    /* @__PURE__ */ jsx("h2", { className: "postCard__title", children: post.title }),
                    /* @__PURE__ */ jsx("p", { className: "postCard__excerpt", children: post.excerpt })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "postCard__tags", children: /* @__PURE__ */ jsx(
                "a",
                {
                  className: "postCard__catLink",
                  href: `${r}${post.category}/`,
                  "aria-label": `${CATEGORY_LABELS[post.category] || post.category} 카테고리로 이동`,
                  children: /* @__PURE__ */ jsx("span", { className: "tag", children: CATEGORY_LABELS[post.category] || post.category })
                }
              ) })
            ]
          },
          post.id
        )) }),
        /* @__PURE__ */ jsx("p", { className: "page__p page__p--emptyInList js-post-search-empty", hidden: true, children: "검색 결과가 없습니다." })
      ] })
    ] })
  ] }) });
}
function AboutPage({ page }) {
  const { active, depth } = page;
  const r = rootPrefixFromDepth(depth);
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
    /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "about-title", children: [
      /* @__PURE__ */ jsx("h1", { id: "about-title", className: "page__h1", children: "소개" }),
      /* @__PURE__ */ jsx("p", { className: "page__meta", children: SITE_TAGLINE })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page__section", children: [
      /* @__PURE__ */ jsxs("h2", { className: "page__h2", children: [
        SITE_NAME,
        "에 대하여"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "page__p", children: [
        SITE_NAME,
        "는 금융·부동산·정책·IT 정보와 라이프스타일·맛집·독서 등 일상에 도움이 되는 주제를 글로 정리하는 블로그입니다. 각 글은 카테고리로 나뉘어 있으며, 글 목록과 개별 글은 고정된 URL 형태로 제공됩니다."
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "page__p", children: [
        "사이트 이용과 개인정보·광고 관련 안내는",
        " ",
        /* @__PURE__ */ jsx("a", { href: `${r}privacy/`, className: "textLink", children: "개인정보처리방침" }),
        " · ",
        /* @__PURE__ */ jsx("a", { href: `${r}terms/`, className: "textLink", children: "이용약관" }),
        "을 참고해 주세요. 문의는",
        " ",
        /* @__PURE__ */ jsx("a", { href: `${r}contact/`, className: "textLink", children: "문의" }),
        "페이지를 이용해 주세요."
      ] })
    ] })
  ] }) });
}
function StaticDocPage({ page }) {
  const { active, depth, type } = page;
  const r = rootPrefixFromDepth(depth);
  if (type === "privacy") {
    return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
      /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "privacy-title", children: [
        /* @__PURE__ */ jsx("h1", { id: "privacy-title", className: "page__h1", children: "개인정보처리방침" }),
        /* @__PURE__ */ jsxs("p", { className: "page__meta", children: [
          SITE_NAME,
          "(이하 사이트)는 이용자의 개인정보를 중요하게 여기며, 관련 법령을 준수합니다. 본 방침은 사이트 이용 시 적용됩니다."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p1", children: [
        /* @__PURE__ */ jsx("h2", { id: "p1", className: "page__h2", children: "수집하는 개인정보 항목" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "사이트는 독자적인 회원가입 절차 없이 정보성 콘텐츠를 제공하는 경우가 많으며, 문의 등 특정 기능을 두는 경우에 한해 이메일 등 최소한의 정보를 요청할 수 있습니다. 또한 접속 로그·쿠키 등이 자동으로 생성·수집될 수 있습니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p2", children: [
        /* @__PURE__ */ jsx("h2", { id: "p2", className: "page__h2", children: "개인정보의 이용 목적" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "문의에 대한 회신, 서비스 개선, 부정 이용 방지, 통계적 분석(비식별 형태), 법적 의무 이행 등에 활용할 수 있습니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p3", children: [
        /* @__PURE__ */ jsx("h2", { id: "p3", className: "page__h2", children: "광고 및 제3자 서비스(구글 애드센스 등)" }),
        /* @__PURE__ */ jsxs("p", { className: "page__p", children: [
          "사이트는 Google 등 광고 파트너를 통해 광고를 게재할 수 있습니다. 이 과정에서 광고 제공자는 이용자의 방문 정보를 바탕으로 맞춤 광고를 보여줄 수 있으며, 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. Google 광고의 경우",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://policies.google.com/technologies/ads",
              className: "textLink",
              rel: "noopener noreferrer",
              target: "_blank",
              children: "Google 광고 정책"
            }
          ),
          "을 참고하시기 바랍니다."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p4", children: [
        /* @__PURE__ */ jsx("h2", { id: "p4", className: "page__h2", children: "보관 및 파기" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "수집 목적이 달성되거나 관련 법령에 따른 보관 기간이 지나면 지체 없이 파기합니다. 다만 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p5", children: [
        /* @__PURE__ */ jsx("h2", { id: "p5", className: "page__h2", children: "이용자의 권리" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "이용자는 개인정보 열람·정정·삭제·처리 정지 등을 요청할 수 있으며, 문의 페이지 또는 아래 연락 경로로 요청할 수 있습니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p6", children: [
        /* @__PURE__ */ jsx("h2", { id: "p6", className: "page__h2", children: "방침의 변경" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "본 방침은 법령·정책 또는 사이트 운영 방침에 따라 변경될 수 있으며, 변경 시 사이트에 게시합니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "p7", children: [
        /* @__PURE__ */ jsx("h2", { id: "p7", className: "page__h2", children: "문의" }),
        /* @__PURE__ */ jsxs("p", { className: "page__p", children: [
          "개인정보와 관련한 문의는",
          " ",
          /* @__PURE__ */ jsx("a", { href: `${r}contact/`, className: "textLink", children: "문의" }),
          "페이지를 이용해 주세요."
        ] })
      ] })
    ] }) });
  }
  if (type === "terms") {
    return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
      /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "terms-title", children: [
        /* @__PURE__ */ jsx("h1", { id: "terms-title", className: "page__h1", children: "이용약관" }),
        /* @__PURE__ */ jsxs("p", { className: "page__meta", children: [
          SITE_NAME,
          "에 오신 것을 환영합니다. 아래 약관은 본 사이트를 이용할 때 적용됩니다."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "t1", children: [
        /* @__PURE__ */ jsx("h2", { id: "t1", className: "page__h2", children: "목적" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "본 약관은 사이트가 제공하는 정보 및 서비스 이용과 관련하여 운영자와 이용자 간 권리·의무를 규정합니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "t2", children: [
        /* @__PURE__ */ jsx("h2", { id: "t2", className: "page__h2", children: "콘텐츠 및 저작권" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "사이트의 글·이미지 등은 저작권법 등 관련 법령의 보호를 받습니다. 이용자는 운영자의 동의 없이 상업적 재배포·무단 복제 등을 하지 않아야 합니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "t3", children: [
        /* @__PURE__ */ jsx("h2", { id: "t3", className: "page__h2", children: "면책" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "사이트에 게재된 정보는 일반적인 참고 목적이며, 법률·세무·투자 등 전문 분야의 확정적 조언으로 보지 않아야 합니다. 이용자의 판단과 책임 하에 활용하시기 바랍니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "t4", children: [
        /* @__PURE__ */ jsx("h2", { id: "t4", className: "page__h2", children: "광고" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "사이트에는 제휴 광고가 노출될 수 있으며, 광고 내용은 광고주의 책임 하에 제공됩니다." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "t5", children: [
        /* @__PURE__ */ jsx("h2", { id: "t5", className: "page__h2", children: "약관의 변경" }),
        /* @__PURE__ */ jsx("p", { className: "page__p", children: "운영자는 필요 시 약관을 변경할 수 있으며, 변경된 내용은 사이트에 게시함으로써 효력이 발생합니다." })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
    /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "contact-title", children: [
      /* @__PURE__ */ jsx("h1", { id: "contact-title", className: "page__h1", children: "문의" }),
      /* @__PURE__ */ jsxs("p", { className: "page__meta", children: [
        SITE_NAME,
        "에 대한 문의·오류 신고·저작권 관련 요청은 아래 경로로 연락해 주세요."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "c1", children: [
      /* @__PURE__ */ jsx("h2", { id: "c1", className: "page__h2", children: "이메일" }),
      /* @__PURE__ */ jsx("p", { className: "page__p", children: "공개 문의용 이메일 주소를 준비 중입니다. 안내가 가능해지는 대로 이 페이지를 통해 알리겠습니다." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page__section", "aria-labelledby": "c2", children: [
      /* @__PURE__ */ jsx("h2", { id: "c2", className: "page__h2", children: "개인정보 관련" }),
      /* @__PURE__ */ jsxs("p", { className: "page__p", children: [
        "개인정보 처리에 대한 안내는",
        " ",
        /* @__PURE__ */ jsx("a", { href: `${r}privacy/`, className: "textLink", children: "개인정보처리방침" }),
        "을 참고해 주세요."
      ] })
    ] })
  ] }) });
}
function CategoryPage({ page }) {
  const { data, active, depth } = page;
  const r = rootPrefixFromDepth(depth);
  const posts = Array.isArray(data.posts) ? data.posts : [];
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsxs("div", { className: "page", children: [
    /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "cat-title", children: [
      /* @__PURE__ */ jsx("h1", { id: "cat-title", className: "page__h1", children: data.label }),
      /* @__PURE__ */ jsx("p", { className: "page__meta", children: "이 카테고리에 해당하는 글입니다." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page__section page__section--posts", "aria-labelledby": "cat-posts", children: [
      /* @__PURE__ */ jsx("h2", { id: "cat-posts", className: "page__h2 page__h2--section", children: "글 목록" }),
      /* @__PURE__ */ jsxs("div", { className: "page__search js-search-scope", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "page__searchInput js-post-search-input",
            type: "search",
            placeholder: "키워드를 검색하세요",
            "aria-label": "카테고리 글 검색"
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "page__searchMeta js-post-search-meta", children: [
          "전체 ",
          posts.length,
          "건"
        ] })
      ] }),
      posts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "page__p page__p--emptyInList", children: "이 카테고리에 등록된 글이 없습니다." }) : /* @__PURE__ */ jsxs("div", { className: "page__listShell", children: [
        /* @__PURE__ */ jsx("div", { className: "postList js-post-search-list", children: posts.map((post) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "postCard js-post-search-item",
            "data-search-text": `${String(post.title || "").toLowerCase()} ${String(post.excerpt || "").toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsx("p", { className: "postCard__date", children: /* @__PURE__ */ jsx("time", { dateTime: post.date, children: post.date }) }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  className: "postCard__linkBlock",
                  href: postListHrefFromDepth(depth, post.fileNum),
                  "aria-label": `${post.title} 글 보기`,
                  children: [
                    /* @__PURE__ */ jsx("h2", { className: "postCard__title", children: post.title }),
                    /* @__PURE__ */ jsx("p", { className: "postCard__excerpt", children: post.excerpt })
                  ]
                }
              )
            ]
          },
          post.id
        )) }),
        /* @__PURE__ */ jsx("p", { className: "page__p page__p--emptyInList js-post-search-empty", hidden: true, children: "검색 결과가 없습니다." })
      ] })
    ] })
  ] }) });
}
function PostPage({ page }) {
  const { data, active, depth } = page;
  const r = rootPrefixFromDepth(depth);
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: r, active, children: /* @__PURE__ */ jsx("div", { className: "page postDetail", children: /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsxs("header", { className: "page__hero postDetail__header", "aria-labelledby": "post-title", children: [
      /* @__PURE__ */ jsx("p", { className: "page__meta", children: /* @__PURE__ */ jsx("time", { dateTime: data.date, children: data.date }) }),
      /* @__PURE__ */ jsx("h1", { id: "post-title", className: "page__h1", children: data.title }),
      /* @__PURE__ */ jsxs("p", { className: "page__meta postDetail__category", children: [
        /* @__PURE__ */ jsx("a", { className: "textLink", href: `${r}${data.category}/`, children: CATEGORY_LABELS[data.category] || data.category }),
        /* @__PURE__ */ jsx("span", { className: "postDetail__sep", children: " · " }),
        /* @__PURE__ */ jsx("a", { className: "textLink", href: r || "./", children: "목록" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "page__section postDetail__body", "aria-label": "본문", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "postBody markdownBody",
        dangerouslySetInnerHTML: { __html: data.bodyHtml }
      }
    ) }),
    Array.isArray(data.relatedPosts) && data.relatedPosts.length > 0 ? /* @__PURE__ */ jsxs("section", { className: "page__section postDetail__related", "aria-labelledby": "post-related", children: [
      /* @__PURE__ */ jsx("h2", { id: "post-related", className: "page__h2 page__h2--section postDetail__relatedTitle", children: "함께 보면 좋은 글" }),
      /* @__PURE__ */ jsx("ul", { className: "postDetail__relatedList", children: data.relatedPosts.map((rp) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: "textLink", href: postListHrefFromDepth(depth, rp.fileNum), children: rp.title }) }, rp.fileNum)) })
    ] }) : null
  ] }) }) });
}
function NotFoundPage({ page }) {
  const { depth = 0 } = page;
  const r = homeDirHrefFromDepth(depth);
  return /* @__PURE__ */ jsx(SiteLayout, { rootPrefix: rootPrefixFromDepth(depth), active: "", children: /* @__PURE__ */ jsx("div", { className: "page page--notFound", children: /* @__PURE__ */ jsxs("section", { className: "page__hero", "aria-labelledby": "notfound-title", children: [
    /* @__PURE__ */ jsx("h1", { id: "notfound-title", className: "page__h1", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "page__meta", children: "요청한 경로를 찾을 수 없습니다." }),
    /* @__PURE__ */ jsx("p", { className: "page__p", children: /* @__PURE__ */ jsx("a", { className: "textLink", href: r, children: "홈으로 돌아가기" }) })
  ] }) }) });
}
function App({ page }) {
  switch (page.type) {
    case "home":
      return /* @__PURE__ */ jsx(HomePage, { page });
    case "about":
      return /* @__PURE__ */ jsx(AboutPage, { page });
    case "privacy":
    case "terms":
    case "contact":
      return /* @__PURE__ */ jsx(StaticDocPage, { page });
    case "category":
      return /* @__PURE__ */ jsx(CategoryPage, { page });
    case "post":
      return /* @__PURE__ */ jsx(PostPage, { page });
    case "notFound":
      return /* @__PURE__ */ jsx(NotFoundPage, { page });
    default:
      return /* @__PURE__ */ jsx(NotFoundPage, { page });
  }
}
function renderAppToString(page) {
  return renderToString(/* @__PURE__ */ jsx(App, { page }));
}
export {
  renderAppToString
};
