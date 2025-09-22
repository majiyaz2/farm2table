import { getPayload } from "payload"
import config from "@payload-config"

const categories = [
    {
      name: "All",
      slug: "all",
    },
    {
      name: "Apples & Pears",
      color: "#FF6B6B",
      slug: "apples-pears",
      subcategories: [
        { name: "Apples", slug: "apples" },
        { name: "Pears", slug: "pears" },
        { name: "Asian Pears", slug: "asian-pears" },
        { name: "Quinces", slug: "quinces" },
      ],
    },
    {
      name: "Stone Fruits & Cherries",
      color: "#E76F51",
      slug: "stone-fruits-cherries",
      subcategories: [
        { name: "Peaches", slug: "peaches" },
        { name: "Nectarines", slug: "nectarines" },
        { name: "Plums", slug: "plums" },
        { name: "Cherries", slug: "cherries" },
        { name: "Apricots", slug: "apricots" },
      ],
    },
    {
      name: "Berries",
      color: "#F94144",
      slug: "berries",
      subcategories: [
        { name: "Strawberries", slug: "strawberries" },
        { name: "Blueberries", slug: "blueberries" },
        { name: "Raspberries", slug: "raspberries" },
        { name: "Blackberries", slug: "blackberries" },
        { name: "Cranberries", slug: "cranberries" },
      ],
    },
    {
      name: "Citrus Fruits",
      color: "#FFB347",
      slug: "citrus-fruits",
      subcategories: [
        { name: "Oranges", slug: "oranges" },
        { name: "Lemons", slug: "lemons" },
        { name: "Limes", slug: "limes" },
        { name: "Grapefruits", slug: "grapefruits" },
        { name: "Mandarines", slug: "mandarines" },
      ],
    },
    {
      name: "Tropical Fruits",
      color: "#F8961E",
      slug: "tropical-fruits",
      subcategories: [
        { name: "Bananas", slug: "bananas" },
        { name: "Mangos", slug: "mangos" },
        { name: "Pineapples", slug: "pineapples" },
        { name: "Papayas", slug: "papayas" },
        { name: "Kiwi", slug: "kiwi" },
      ],
    },
    {
      name: "Melons",
      color: "#F9844A",
      slug: "melons",
      subcategories: [
        { name: "Watermelons", slug: "watermelons" },
        { name: "Cantaloupes", slug: "cantaloupes" },
        { name: "Honeydews", slug: "honeydews" },
        { name: "Personal Melons", slug: "personal-melons" },
      ],
    },
    {
      name: "Grapes & More",
      color: "#F3722C",
      slug: "grapes-more",
      subcategories: [
        { name: "Grapes", slug: "grapes" },
        { name: "Avocados", slug: "avocados" },
        { name: "Figs", slug: "figs" },
        { name: "Pomegranates", slug: "pomegranates" },
        { name: "Persimmons", slug: "persimmons" },
      ],
    },
    {
      name: "Salad Greens",
      color: "#2EC4B6",
      slug: "salad-greens",
      subcategories: [
        { name: "Lettuce", slug: "lettuce" },
        { name: "Spinach", slug: "spinach" },
        { name: "Kale", slug: "kale" },
        { name: "Arugula", slug: "arugula" },
        { name: "Romaine", slug: "romaine" },
      ],
    },
    {
      name: "Root Veggies",
      color: "#E71D36",
      slug: "root-veggies",
      subcategories: [
        { name: "Carrots", slug: "carrots" },
        { name: "Potatoes", slug: "potatoes" },
        { name: "Sweet Potatoes", slug: "sweet-potatoes" },
        { name: "Onions", slug: "onions" },
        { name: "Beets", slug: "beets" },
      ],
    },
    {
      name: "Broccoli & Cabbage Family",
      color: "#8338EC",
      slug: "broccoli-cabbage",
      subcategories: [
        { name: "Broccoli", slug: "broccoli" },
        { name: "Cauliflower", slug: "cauliflower" },
        { name: "Cabbage", slug: "cabbage" },
        { name: "Brussels Sprouts", slug: "brussels-sprouts" },
        { name: "Kohl Rabi", slug: "kohl-rabi" },
      ],
    },
    {
      name: "Tomatoes & Peppers",
      color: "#FF006E",
      slug: "tomatoes-peppers",
      subcategories: [
        { name: "Tomatoes", slug: "tomatoes" },
        { name: "Bell Peppers", slug: "bell-peppers" },
        { name: "Chili Peppers", slug: "chili-peppers" },
        { name: "Eggplants", slug: "eggplants" },
      ],
    },
    {
      name: "Cucumbers & Squash",
      color: "#A239CA",
      slug: "cucumbers-squash",
      subcategories: [
        { name: "Cucumbers", slug: "cucumbers" },
        { name: "Zucchini", slug: "zucchini" },
        { name: "Summer Squash", slug: "summer-squash" },
        { name: "Butternut Squash", slug: "butternut-squash" },
        { name: "Pumpkins", slug: "pumpkins" },
      ],
    },
    {
      name: "Beans & Peas",
      color: "#06FFA5",
      slug: "beans-peas",
      subcategories: [
        { name: "Green Beans", slug: "green-beans" },
        { name: "Peas", slug: "peas" },
        { name: "Snow Peas", slug: "snow-peas" },
        { name: "Edamame", slug: "edamame" },
        { name: "Okra", slug: "okra" },
      ],
    },
    {
      name: "Herbs & Garlic",
      color: "#3A86FF",
      slug: "herbs-garlic",
      subcategories: [
        { name: "Garlic", slug: "garlic" },
        { name: "Basil", slug: "basil" },
        { name: "Cilantro", slug: "cilantro" },
        { name: "Parsley", slug: "parsley" },
        { name: "Mint", slug: "mint" },
      ],
    },
    {
      name: "Organic & Special",
      color: "#B8E6C9",
      slug: "organic-special",
      subcategories: [
        { name: "Organic Fruits", slug: "organic-fruits" },
        { name: "Organic Veggies", slug: "organic-veggies" },
        { name: "Exotic Produce", slug: "exotic-produce" },
        { name: "Pre-Cut Fruits", slug: "pre-cut-fruits" },
        { name: "Salad Kits", slug: "salad-kits" },
      ],
    },
    {
      name: "Other",
      slug: "other",
    },
  ]


const seed = async () => {
    const payload = await getPayload({config})

    try {
     for (const category of categories) {
        const parentCategory = await payload.create({
            collection: "categories",
            data: {
                name: category.name,
                slug: category.slug,
                color: category.color,
                parent: null,
            }
        })

        for (const subCategory of category.subcategories || []){
            await payload.create({
                collection: "categories",
                data: {
                    name: subCategory.name,
                    slug: subCategory.slug,
                    parent: parentCategory.id,
                }
            })
        }
     }   
    } catch (error) {
        console.log('Error during seeding: ',error)
    }
}


try {
    await seed()
    console.log("Seeding completed successfully")
    process.exit(0)
} catch (error) {
    console.log("Error during seeding: ", error)
    process.exit(1)
}