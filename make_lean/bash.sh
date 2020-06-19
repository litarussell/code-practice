# 0-标准输入
# 1-标准输出
# 2-标准错误

# 重定向:
# >: 	先清空文件再写入文件
# >>: 将重定向的内容追加到文件尾部

# 判断
if i386-jos-elf-objdump -i 2>&1 | grep '^elf32-i386$' >/dev/null 2>&1;
then echo "then"
else echo "else"
fi