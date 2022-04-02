/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { MenuItem, TextField, Typography } from '@mui/material'
import { setLang, setTheme } from 'slices/settings'
import { useStoreDispatch, useStoreSelector } from 'store'

import PaperTop from '@ui/mui-extends/esm/PaperTop'
import Space from '@ui/mui-extends/esm/Space'
import i18n from 'components/T'
import messages from 'i18n/messages'

const Other = () => {
  const { settings } = useStoreSelector((state) => state)
  const { theme, lang } = settings
  const dispatch = useStoreDispatch()

  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setTheme(e.target.value))
  const handleChangeLang = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setLang(e.target.value))

  return (
    <>
      <PaperTop title={i18n('common.other')} divider />
      <Space>
        <TextField
          select
          size="small"
          style={{ width: '50%' }}
          label={i18n('settings.theme.title')}
          helperText={i18n('settings.theme.choose')}
          value={theme}
          onChange={handleChangeTheme}
        >
          <MenuItem value="light">
            <Typography>{i18n('settings.theme.light')}</Typography>
          </MenuItem>
          <MenuItem value="dark">
            <Typography>{i18n('settings.theme.dark')}</Typography>
          </MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          style={{ width: '50%' }}
          label={i18n('settings.lang.title')}
          helperText={i18n('settings.lang.choose')}
          value={lang}
          onChange={handleChangeLang}
        >
          {Object.keys(messages).map((lang) => (
            <MenuItem key={lang} value={lang}>
              <Typography>{i18n(`settings.lang.${lang}`)}</Typography>
            </MenuItem>
          ))}
        </TextField>
      </Space>
    </>
  )
}

export default Other
