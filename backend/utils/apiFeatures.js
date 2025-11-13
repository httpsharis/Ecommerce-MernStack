class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                }
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove unwanted fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Handle all price operators
        const operators = ['gte', 'lte', 'gt', 'lt'];
        operators.forEach(op => {
            if (queryCopy[`price[${op}]`]) {
                if (!queryCopy.price) queryCopy.price = {};
                queryCopy.price[`$${op}`] = Number(queryCopy[`price[${op}]`]);
                delete queryCopy[`price[${op}]`];
            }
        });

        this.query = this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage) {
        // Current Page 
        const currentPage = Number(this.queryStr.page) || 1

        // Skip
        const skip = resultPerPage * (currentPage - 1)
        
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures;