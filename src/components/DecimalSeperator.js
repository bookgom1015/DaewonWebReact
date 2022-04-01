export default function setComma(expr) {
    return expr.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}