import { stringify } from "qs";

const keyBreak = "--"
export function unionKey() {
    var i, numargs = arguments.length;
     
    if (numargs < 1)
        return ""
    var ret = "" + arguments[0]
    for (i = 1; i < numargs; i++)
    {
      ret += keyBreak 
      ret += arguments[i];
    }
    return(ret);
}