//yarn run local为本地调试模式
const loc =  process.env.NODE_ENV === "loc"
if(loc) {
  import('./local')
} else {
  import('@/production')
}
console.log('node_env',process.env.NODE_ENV)

