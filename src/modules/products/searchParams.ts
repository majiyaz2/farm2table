import {createLoader, parseAsArrayOf, parseAsString, parseAsStringEnum} from "nuqs/server";

export const sortOptions = ["curated", "trending", "hot_and_new"]

const params = {
    sort: parseAsStringEnum(sortOptions)
    .withDefault("curated").withOptions({
        clearOnDefault: true,
    }),
    minPrice: parseAsString
    .withOptions({
        clearOnDefault: true
    }),
    maxPrice: parseAsString
    .withOptions({
        clearOnDefault: true
    }),
    tags: parseAsArrayOf(parseAsString)
    .withOptions({
        clearOnDefault: true
    }),
}

export const loadProductFilters = createLoader(params);