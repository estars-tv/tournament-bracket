function isEmpty(value) {
    return value !== "";
}

function removeEmptyElements(arr) {
    return arr.filter(isEmpty);
}

export default removeEmptyElements;