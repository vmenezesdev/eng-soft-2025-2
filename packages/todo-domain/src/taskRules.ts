
function validateTitle(title: string) : "valid" | "invalid" {
    if(title != null && title != undefined) {
        return "valid"
    }
    return "invalid";
}

export { validateTitle };