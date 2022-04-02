// /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g -- This regular expressions isn't supported in Mac;;
// /\B(?=(\d{3})+(?!\d))/g -- Use this instead

export default function setComma(expr) {
    return expr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}