MERGE_PROJECT = iot-front
MERGE_PROJECT_DIR = ../$(MERGE_PROJECT)
MERGE_SRC_DIR = $(MERGE_PROJECT_DIR)/src
FRAME_SRC_DIR = ../vue3-go-template/vue3-go-template-front/src/*
MODULES_SRC_DIR = ../test-module2/front-module2/src/modules/module2/
SRCS = $(MODULES_SRC_DIR)
define cp_frame
	mkdir -p $(MERGE_SRC_DIR)
	cp -r $(FRAME_SRC_DIR) $(MERGE_SRC_DIR)
	cp package-all.json $(MERGE_PROJECT_DIR)/package.json
endef

define cp_src
	echo $(MERGE_SRC_DIR)
	mkdir -p $(MERGE_SRC_DIR)/modules/
	echo $(1)
	cp -r \
	$(1) \
	$(MERGE_SRC_DIR)/modules/
endef

#拷贝前端框架	
frame:
	$(call cp_frame)

$(SERVICES):
	$(call compile_service,$(@))

merge: frame $(SRCS)

.PHONY: all $(SRCS) merge frame

$(SRCS):
	$(call cp_src,$(@))
