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
import * as Yup from 'yup'

import { FormikProps, FormikValues, getIn } from 'formik'
import { InputAdornment, MenuItem } from '@mui/material'
import { SelectField, TextField } from 'components/FormField'

import i18n from 'components/T'

export interface ScheduleSpecific {
  schedule: string
  historyLimit?: number
  concurrencyPolicy?: 'Forbid' | 'Allow'
  startingDeadlineSeconds?: number
}

export const data: ScheduleSpecific = {
  schedule: '',
  historyLimit: 1,
  concurrencyPolicy: 'Forbid',
  startingDeadlineSeconds: undefined,
}

export const Fields = ({ errors, touched }: Pick<FormikProps<FormikValues>, 'errors' | 'touched'>) => (
  <>
    <TextField
      fast
      type="number"
      name="spec.historyLimit"
      label={i18n('newS.basic.historyLimit')}
      helperText={
        getIn(errors, 'spec.historyLimit') && getIn(touched, 'spec.historyLimit')
          ? getIn(errors, 'spec.historyLimit')
          : i18n('newS.basic.historyLimitHelper')
      }
      error={getIn(errors, 'spec.historyLimit') && getIn(touched, 'spec.historyLimit') ? true : false}
    />
    <SelectField
      name="spec.concurrencyPolicy"
      label={i18n('newS.basic.concurrencyPolicy')}
      helperText={
        getIn(errors, 'spec.concurrencyPolicy') && getIn(touched, 'spec.concurrencyPolicy')
          ? getIn(errors, 'spec.concurrencyPolicy')
          : i18n('newS.basic.concurrencyPolicyHelper')
      }
      error={getIn(errors, 'spec.concurrencyPolicy') && getIn(touched, 'spec.concurrencyPolicy') ? true : false}
    >
      <MenuItem value="Forbid">{i18n('newS.basic.forbid')}</MenuItem>
      <MenuItem value="Allow">{i18n('newS.basic.allow')}</MenuItem>
    </SelectField>
    <TextField
      fast
      type="number"
      name="spec.startingDeadlineSeconds"
      label={i18n('newS.basic.startingDeadlineSeconds')}
      InputProps={{
        endAdornment: <InputAdornment position="end">{i18n('common.seconds')}</InputAdornment>,
      }}
      helperText={
        getIn(errors, 'spec.startingDeadlineSeconds') && getIn(touched, 'spec.startingDeadlineSeconds')
          ? getIn(errors, 'spec.startingDeadlineSeconds')
          : i18n('newS.basic.startingDeadlineSecondsHelper')
      }
      error={
        getIn(errors, 'spec.startingDeadlineSeconds') && getIn(touched, 'spec.startingDeadlineSeconds') ? true : false
      }
    />
  </>
)

export const schema = {
  historyLimit: Yup.number().min(1, 'The historyLimit is at least 1'),
  concurrencyPolicy: Yup.string().required('The concurrencyPolicy is required'),
  startingDeadlineSeconds: Yup.number().min(0, 'The startingDeadlineSeconds is at least 0').nullable(true),
}
