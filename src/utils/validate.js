/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  }
  
  /**
   * 手机号码
   * @param {*} s
   */
  export function isMobile (s) {
    return /^1[0-9]{10}$/.test(s)
  }
  
  /**
   * 电话号码
   * @param {*} s
   */
  export function isPhone (s) {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
  }
  
  /**
   * URL地址
   * @param {*} s
   */
  export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
  }
  
  /**
   * 匹配数字，可以是小数，不可以是负数,可以为空
   * @param {*} s 
   */
  export function isNumber(s){
    return  /(^-?[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$)|(^$)/.test(s);
  }
  /**
   * 匹配整数，可以为空
   * @param {*} s 
   */
  export function isIntNumer(s){
    return  /(^-?\d+$)|(^$)/.test(s);
  }

  