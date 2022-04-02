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
import { Button, ButtonProps } from '@mui/material'

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import i18n from 'components/T'
import { setAlert } from 'slices/globalStatus'
import { useIntl } from 'react-intl'
import { useStoreDispatch } from 'store'

interface YAMLProps {
  callback: (y: any) => void
  buttonProps?: ButtonProps<'label'>
}

const YAML: React.FC<YAMLProps> = ({ callback, buttonProps }) => {
  const intl = useIntl()

  const dispatch = useStoreDispatch()

  const handleUploadYAML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files![0]

    const reader = new FileReader()
    reader.onload = function () {
      const y = reader.result

      callback(y)

      dispatch(
        setAlert({
          type: 'success',
          message: i18n('confirm.success.load', intl),
        })
      )
    }
    reader.readAsText(f)
  }

  return (
    <Button {...buttonProps} component="label" variant="outlined" size="small" startIcon={<CloudUploadOutlinedIcon />}>
      {i18n('common.upload')}
      <input type="file" hidden onChange={handleUploadYAML} />
    </Button>
  )
}

export default YAML
