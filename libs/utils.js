import moment from "moment";
export function getTime(time) {
  return moment(time).fromNow();
}
