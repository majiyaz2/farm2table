interface Props {
    params: Promise<{category: string}>;
}

const CategoryPage = async ({params}: Props) => {
    const {category} = await params;
    return (
        <div>
            <h1>Category Page: {category}</h1>
        </div>
    );
};

export default CategoryPage;
