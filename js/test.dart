
void main() {
  // var e = new RegExp(r'[\u4e00-\u9fa5]');
  // print(e.hasMatch('afewafw few啊aa'));
  var s = new Set();
  s.addAll([1,2,3,4]);
  for (var e in s) {
    print(e);
  }
}
