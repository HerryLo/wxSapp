/**
 * 随机获取数组 下标
 * @param len 数组长度
 * 0 ~ l-1
 */
export function getRandomIndex ( len : number): number {
  let l: number = len;
  return Math.floor(Math.random() * l);
}

/**
 *
 * @param arr 数组
 * @param n 需要循环的长度
 */
export function randomArray<T>(arr: T[], n: number): T[] {
  let list: T[] = []
  let len = arr.length
  let i: number = 0
  while(i < n) {
    i++;
    let r: number = getRandomIndex(len)
    list.push(arr[r])
  }
  return list
}

export function handleTime(obsTime) {
  if(!obsTime) return '--'
  const time = new Date(obsTime);
  const year = time.getFullYear();
  const month = time.getMonth()+1;
  const day = time.getDate();
  const hour = time.getHours();
  const minutes = time.getMinutes()
  return `${year}-${month}-${day} ${hour}:${minutes}:00`
}
