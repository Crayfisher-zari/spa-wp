import {
  createApp,
  ref,
  computed,
  onMounted,
} from "/wp-content/themes/twentytwenty/assets/js/vue.esm-browser.js";

// 1ページあたりの表示数
const postPerPage = document.querySelector("span[data-postperpage]")?.dataset
  .postperpage;

const app = createApp({
  setup() {
    /** カテゴリー */
    const categories = ref(null);

    /** タグ */
    const tags = ref(null);

    /** 現在のページ */
    const currentPage = ref(1);

    /** 記事を格納変数 */
    const articles = ref(null);

    /** 最大ページ数 */
    const maxPage = ref(null);

    /** 選択されたカテゴリー */
    const selectedCategory = ref("all");

    /** 選択されたタグ */
    const selectedTag = ref("all");

    /**
     * 絞り込みの選択状態に応じてクエリを作成します
     */
    const query = computed(() => {
      if (selectedCategory.value === "all" && selectedTag.value === "all") {
        return null;
      } else if (
        selectedCategory.value !== "all" &&
        selectedTag.value === "all"
      ) {
        return `categories=${selectedCategory.value}`;
      } else if (
        selectedCategory.value === "all" &&
        selectedTag.value !== "all"
      ) {
        return `tags=${selectedTag.value}`;
      } else {
        return `categories=${selectedCategory.value}&tags=${selectedTag.value}`;
      }
    });

    /**
     * すべてのカテゴリーをフェッチして、格納します
     */
    const fetchAndStoreCategoryList = async () => {
      const result = await fetch(`/wp-json/wp/v2/categories`);
      categories.value = await result.json();
    };

    /**
     * すべてのタグをフェッチして、格納します
     */
    const fetchAndStoreTagList = async () => {
      const result = await fetch(`/wp-json/wp/v2/tags`);
      tags.value = await result.json();
    };

    /**
     * 記事データをフェッチして格納します。クエリがある場合はクエリに基づいた絞り込みを行います
     */
    const fetchAndStoreArticle = async () => {
      let result;
      if (query.value) {
        result = await fetch(
          `/wp-json/wp/v2/posts/?${query.value}&per_page=${postPerPage}&page=${currentPage.value}`
        );
      } else {
        result = await fetch(
          `/wp-json/wp/v2/posts/?per_page=${postPerPage}&page=${currentPage.value}`
        );
      }
      maxPage.value = Number(result.headers.get("X-WP-TotalPages"));
      articles.value = await result.json();
    };

    /**
     * カテゴリーIDからカテゴリー名に変換します
     * @param {string} id
     * @returns string カテゴリー名
     */
    const convertCategoryIdToName = (id) =>
      categories.value.find((category) => category.id === id).name;

    /**
     * タグIDからタグ名に変換します
     * @param {string} id
     * @returns string タグ名
     */
    const convertTagIdToName = (id) =>
      tags.value.find((tag) => tag.id === id).name;

    /**
     * カテゴリーやタグに基づいた絞り込んでフェットします
     */
    const fetchByFilter = async () => {
      currentPage.value = 1;
      await fetchAndStoreArticle();
    };
    /**
     * 次のページのデータをフェッチします
     * @returns void
     */
    const fetchNextPage = async () => {
      if (currentPage.value === maxPage.value) {
        return;
      }
      currentPage.value++;
      await fetchAndStoreArticle();
    };

    /**
     * 前のページのデータをフェッチします
     * @returns void
     */
    const fetchPreviousPage = async () => {
      if (currentPage.value === 1) {
        return;
      }
      currentPage.value--;
      await fetchAndStoreArticle();
    };

    onMounted(async () => {
      // カテゴリーとタグを取得
      await fetchAndStoreCategoryList();
      await fetchAndStoreTagList();
      // 最新10件を取得
      fetchAndStoreArticle();
    });

    return {
      categories,
      selectedCategory,
      tags,
      selectedTag,
      articles,
      currentPage,
      maxPage,
      convertTagIdToName,
      convertCategoryIdToName,
      fetchByFilter,
      fetchNextPage,
      fetchPreviousPage,
    };
  },
});
app.mount("#app");
