interface Props {
    params: Promise<{
        category: string
        subcategory: string
    }>;
}

const CategoryPage = async ({params}: Props) => {
    const {category, subcategory} = await params;
    return (
        <div>
            <h1>Category Page: {category}</h1>
            <h2>Subcategory Page: {subcategory}</h2>
        </div>
    );
};

export default CategoryPage;
