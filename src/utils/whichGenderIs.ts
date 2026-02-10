export const whichGenderIs = (gender: string) => {
    switch (gender) {
        case "men":
            return "Artículos para hombres";
        case "women":
            return "Artículos para mujeres";
        case "kid":
            return "Artículos para niños";
        default:
            return "Artículos unisex";
    }
};