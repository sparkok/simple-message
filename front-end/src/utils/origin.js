const url = new URL('./', import.meta.url)
export const getWebDomain = () => {
    console.log('web base url:',url)
    return url.origin
}

