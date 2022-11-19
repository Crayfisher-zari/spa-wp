<style>
.contents {
  width: 1080px;
  margin: 0 auto;
  padding-top: 32px;
}

.articles {
  margin: 0;
  padding: 16px 0;
}

.article {
  list-style: none;
  margin: 0;
  padding: 16px 0;
  border-bottom: 1px solid #999;
}

.article:last-child {
  border-bottom: none;
}

.article_link {
  display: grid;
  grid-template: "category tag" "category title" / 120px 1fr;
  text-decoration: none;
  color: #000;
}

.article_category {
  grid-area: category;
  display: grid;
  justify-content: start;
  align-items: center;
  margin: 0;
  font-size: 16px;
}

.article_tag {
  grid-area: tag;
  margin: 0;
  font-size: 14px;
}

.article_title {
  grid-area: title;
  margin: 0;
  padding: 8px 0;
  font-size: 24px;
}

.selector {
  display: flex;
}

.selector label {
  display: inline-block;
  margin: 0 24px 0 0;
  cursor: pointer;
}

.buttonBlock {
  display: flex;
  justify-content: space-between;
}

button:disabled {
  background-color: gray;
  opacity: 0.6;
}

</style>
<?php
$posts_per_page = get_option( 'posts_per_page' );
?>
<div id="app" class="contents" v-cloak>
  <span data-postperpage="<?php echo $posts_per_page ?>"></span>
  <p class="category">
    カテゴリー： <br />
    <span class="selector">
      <label>
        <input
          type="radio"
          name="category"
          value="all"
          v-model="selectedCategory"
          checked
          @change="fetchByFilter"
        />すべて
      </label>
      <label v-for="category in categories">
        <input
          type="radio"
          name="category"
          :value="category.id"
          v-model="selectedCategory"
          @change="fetchByFilter"
        />{{category.name}}
      </label>
    </span>
  </p>

  <p>
    タグ：<br />
    <span class="selector">
      <label>
        <input
          type="radio"
          name="tag"
          value="all"
          v-model="selectedTag"
          checked
          @change="fetchByFilter"
        />すべて
      </label>
      <label v-for="tag in tags">
        <input
          type="radio"
          name="tag"
          :value="tag.id"
          v-model="selectedTag"
          @change="fetchByFilter"
        />{{tag.name}}
      </label>
    </span>
  </p>

  <ul class="articles" v-if="articles">
    <li v-for="article in articles" :key="article.id" class="article">
      <a :href="article.link" class="article_link">
        <p class="article_category">
          {{convertCategoryIdToName(article.categories[0])}}
        </p>
        <p class="article_tag">{{convertTagIdToName(article.tags[0])}}</p>
        <h2 class="article_title">{{article.title.rendered}}</h2>
      </a>
    </li>
  </ul>
  <p class="buttonBlock">
    <button @click="fetchPreviousPage" :disabled="currentPage === 1">
      Prev
    </button>
    <button @click="fetchNextPage" :disabled="currentPage === maxPage">
      Next
    </button>
  </p>
</div>

<script type="module" defer src="/wp-content/themes/twentytwenty/assets/js/spa.js"></script>
