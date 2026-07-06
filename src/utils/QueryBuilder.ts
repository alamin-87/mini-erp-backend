import type { Query } from "mongoose";
import type { IQueryConfig, IQueryParams, IQueryMeta, IQueryResult } from "../interfaces/query.interface";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: IQueryParams;
  public queryConfig: IQueryConfig;

  constructor(modelQuery: Query<T[], T>, query: IQueryParams, queryConfig: IQueryConfig = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.queryConfig = queryConfig;
  }

  public search(): this {
    const searchTerm = this.query.searchTerm?.toString().trim();
    const searchableFields = this.queryConfig.searchableFields || [];

    if (!searchTerm || searchableFields.length === 0) {
      return this;
    }

    const searchRegex = new RegExp(searchTerm, "i");
    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map((field) => ({ [field]: searchRegex })),
    } as any);

    return this;
  }

  public filter(): this {
    const queryCopy = { ...this.query };
    const excludedFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];

    excludedFields.forEach((field) => delete queryCopy[field]);

    const filterableFields = this.queryConfig.filterableFields || [];
    const filter: Record<string, unknown> = {};

    Object.entries(queryCopy).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      if (filterableFields.length > 0 && !filterableFields.includes(key)) {
        return;
      }

      if (typeof value === "string") {
        const normalizedValue = value.trim();
        if (normalizedValue === "") {
          return;
        }

        if (normalizedValue.startsWith("[") && normalizedValue.endsWith("]")) {
          try {
            filter[key] = JSON.parse(normalizedValue);
          } catch {
            filter[key] = normalizedValue;
          }
        } else if (normalizedValue.includes("|")) {
          filter[key] = { $in: normalizedValue.split("|") };
        } else {
          filter[key] = normalizedValue;
        }
      } else {
        filter[key] = value;
      }
    });

    if (Object.keys(filter).length > 0) {
      this.modelQuery = this.modelQuery.find(filter as any);
    }

    return this;
  }

  public sort(): this {
    const sortBy = this.query.sortBy?.toString();
    const sortOrder = this.query.sortOrder === "asc" ? 1 : -1;

    if (!sortBy) {
      return this;
    }

    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    return this;
  }

  public paginate(): this {
    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  public async execute(): Promise<IQueryResult<T>> {
    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);

    const [data, total] = await Promise.all([
      this.modelQuery.clone().exec(),
      this.modelQuery.model.countDocuments(this.modelQuery.getFilter()).exec(),
    ]);

    const meta: IQueryMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data, meta };
  }
}
