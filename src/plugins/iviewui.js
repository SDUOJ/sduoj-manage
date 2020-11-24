/*
 * Copyright 2020-2020 the original author or authors.
 *
 * Licensed under the General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import Vue from 'vue';
import '../styles/iview-variables.less';
import '../styles/global.less';
import ViewUI from 'view-design'

import locale from 'view-design/dist/locale/en-US';

Vue.use(ViewUI, { locale });
