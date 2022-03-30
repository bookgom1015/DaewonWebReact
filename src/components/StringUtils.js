function removeSpecChars(str) {  
    let reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if(reg.test(str)) return str.replace(reg, "");
    
    return str;
}

export default removeSpecChars;