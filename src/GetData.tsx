export const GetUsers = () => {
    return fetch('https://api.jsonbin.io/b/615559d79548541c29bb1d1a/latest').then(res => res.json());
}