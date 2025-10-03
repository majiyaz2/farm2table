import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates} from "nuqs";

const sortValues = ["curated", "trending", "hot_and_new"];
const params = {
    sort: parseAsStringEnum(sortValues).withDefault("curated").withOptions({
        clearOnDefault: true
    }),
    minPrice: parseAsString
    .withOptions({
        clearOnDefault: true
    }).withDefault(""),
    maxPrice: parseAsString
    .withOptions({
        clearOnDefault: true
    }).withDefault(""),
    tags: parseAsArrayOf(parseAsString)
    .withOptions({
        clearOnDefault: true
    }).withDefault([]),
}

export const useProductFilters = () => {

    return useQueryStates(params);
}


