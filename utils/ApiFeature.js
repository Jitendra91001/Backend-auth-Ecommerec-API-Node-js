class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const copyqueryStr = { ...this.queryStr };
    //remove filter fields
    const removekeywords = ["keyword", "pages", "limit"];
    removekeywords.forEach((ele) => delete copyqueryStr[ele]);

    let querystr = JSON.stringify(copyqueryStr);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querystr));
    console.log(querystr);
    return this;
  }

  pagination(resultperpage) {
    const currentpage = Number(this.queryStr.pages) || 1;
    const skip = resultperpage * (currentpage - 1);
    //     console.log(currentpage, skip);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }
}

module.exports = ApiFeature;
