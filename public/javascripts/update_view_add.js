const clearAll = () => {
    var data = document.getElementsByClassName("clearValues");
    for(i = 0; i < data.length; i++){
        data[i].value = "";
    }
}