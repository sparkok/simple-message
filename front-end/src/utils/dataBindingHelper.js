export function createCurry(func, args) {
    var arity = func.length;
    args = args || [];
  
    return function() {
      var _args = [].slice.call(arguments);
      [].push.apply(_args, args);
  
      // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
      if (_args.length < arity) {
        return createCurry.call(this, func, _args);
      }
  
      // 参数收集完毕，则执行func
      return func.apply(this, _args);
    }
  }
  export  function createObjectListBinding(func, queryParams) {
    return async function(response) {
      //console.log('createObjectListBinding',queryParams,"response",response)
      const res = await func(queryParams)
      response(res)
    }
  }
  export function makeKeywords(params) {
    const result = []
    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        if (param.indexOf('And') === 0) {
          const value = makeKeywords(params[param])
          if (value != null) { // 如果名字中有And的前缀则表示And
            result.push({ field: param, keywords: value, fieldType: 'And' })
          }
        } else if (param.indexOf('Or') === 0) { // 如果名字中有Or的前缀则表示Or
          const value = makeKeywords(params[param])
          if (value != null) {
            result.push({ field: param, keywords: value, fieldType: 'Or' })
          }
        } else {
          const { keywords, fieldType, field, compareSign } = params[param]
          if (keywords !== undefined && keywords !== null && keywords !== '') {
            result.push({ field, keywords, fieldType, compareSign })
          }
        }
      }
    }
    return result.length > 0 ? result : null
  }
  export function makeSearchKeywords(params) {
    const searchKeywords = []
    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        const { keywords, fieldType, field, compareSign } = params[param]
        if (keywords !== undefined && keywords !== null && keywords !== '') {
          searchKeywords.push({ field, keywords, fieldType, compareSign })
        }
      }
    }
    return searchKeywords.length > 0 ? { searchKeywords } : null
  }
  