#!/bin/bash
java -jar compiler.jar \
--js ../libs/EventDispatcher.js \
--js ../libs/ArrayIterator.js \
--js ../src/Pop.js \
--js ../src/Dialogue.js \
--js_output_file ../dist/pop.min.js