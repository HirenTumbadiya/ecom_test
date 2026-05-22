const BASE_URL = "https://api.escuelajs.co/api/v1";


export const getCategories = async () => {

    const response = await fetch(
        `${BASE_URL}/categories`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return response.json();
};
