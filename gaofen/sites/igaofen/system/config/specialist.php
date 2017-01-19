<?php

//因为windows 环境没有ffmpeg 无法测试生成mp3流程，所以加一个配置，本地测试不走mp3流程，走amr原文件
$config['wexin_audio_postfix'] = '.amr';