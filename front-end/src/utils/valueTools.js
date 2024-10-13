import { stringify } from "qs";

export function convertString(obj) {
    let ret = {}
    
    for (const key in obj) {
        if(obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
            ret[key] = ""+obj[key]
            //console.log('convertString('+key+') = \'' +obj[key] + '\' => \''+ ret[key] + '\'')
        }
    }
    return ret;
}
