OUT = ./out
SRC = ./src
srcfiles = $(wildcard src/*.c)
OBJ = \
	$(OUT)/a.o\
	$(OUT)/b.o\

target: $(OBJ)

$(OUT)/%.o: $(SRC)/%.c
	$(CC) -c $< -o $@

clean:
	rm -r $(OUT)/*
.PHONY: clean

# 0-标准输入
# 1-标准输出
# 2-标准错误
ifndef TOOLPREFIX
TOOLPREFIX := $(shell if i386-jos-elf-objdump -i 2>&1 | grep '^elf32-i386$$' >/dev/null 2>&1; \
	then echo 'i386-jos-elf-'; \
	elif objdump -i 2>&1 | grep 'elf32-i386' >/dev/null 2>&1; \
	then echo ''; \
	else echo "***" 1>&2; fi)
endif

# .ONESHELL:
# test-make:
# 	@# 测试
# 	export foo=bar; \
# 	echo "foo=[$$foo]"; \
# 	echo $(CC); \
# 	echo $(srcfiles);\
# 	echo $(OBJ)