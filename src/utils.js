

export default {
  /**
   * 
   * @param {Array} arrayLike 
   * @param {(index: number, node: any) => void} cb 
   */
  each(arrayLike, cb) {
    for (let i = 0; i < arrayLike.length; i++) {
      if (!!cb(i, arrayLike[i], arrayLike)) {
        break
      }
    }
  },
  flatArr(arr) {
    return arr.reduce((prev, next) => {
      return prev.concat(Array.isArray(next) ? this.flatArr(next) : next)
    }, [])
  }
}