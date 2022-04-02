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

import { Box, Button, Checkbox, Typography, styled } from '@mui/material'
import { Confirm, setAlert, setConfirm } from 'slices/globalStatus'
import { FixedSizeList as RWList, ListChildComponentProps as RWListChildComponentProps } from 'react-window'

import AddIcon from '@mui/icons-material/Add'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { Experiment } from 'api/experiments.type'
import FilterListIcon from '@mui/icons-material/FilterList'
import Loading from '@ui/mui-extends/esm/Loading'
import NotFound from 'components/NotFound'
import ObjectListItem from 'components/ObjectListItem'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import Space from '@ui/mui-extends/esm/Space'
import _groupBy from 'lodash.groupby'
import api from 'api'
import i18n from 'components/T'
import { transByKind } from 'lib/byKind'
import { useIntervalFetch } from 'lib/hooks'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStoreDispatch } from 'store'

const StyledCheckBox = styled(Checkbox)({
  position: 'relative',
  left: -11,
  paddingRight: 0,
  '&:hover': {
    background: 'none !important',
  },
})

export default function Experiments() {
  const intl = useIntl()
  const navigate = useNavigate()

  const dispatch = useStoreDispatch()

  const [loading, setLoading] = useState(true)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [batch, setBatch] = useState<Record<uuid, boolean>>({})
  const batchLength = Object.keys(batch).length
  const isBatchEmpty = batchLength === 0

  const fetchExperiments = (intervalID?: number) => {
    api.experiments
      .experiments()
      .then(({ data }) => {
        setExperiments(data)

        if (data.every((d) => d.status === 'finished' || d.status === 'paused')) {
          clearInterval(intervalID)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useIntervalFetch(fetchExperiments)

  const handleSelect = (selected: Confirm) => dispatch(setConfirm(selected))
  const onSelect = (selected: Confirm) =>
    dispatch(
      setConfirm({
        title: selected.title,
        description: selected.description,
        handle: handleAction(selected.action, selected.uuid),
      })
    )

  const handleAction = (action: string, uuid?: uuid) => () => {
    let actionFunc: any
    let arg: any

    switch (action) {
      case 'archive':
        actionFunc = api.experiments.del
        arg = uuid

        break
      case 'archiveMulti':
        action = 'archive'
        actionFunc = api.experiments.delMulti
        arg = Object.keys(batch)
        setBatch({})

        break
      case 'pause':
        actionFunc = api.experiments.pause
        arg = uuid

        break
      case 'start':
        actionFunc = api.experiments.start
        arg = uuid

        break
    }

    if (actionFunc) {
      actionFunc(arg)
        .then(() => {
          dispatch(
            setAlert({
              type: 'success',
              message: i18n(`confirm.success.${action}`, intl),
            })
          )

          setTimeout(fetchExperiments, 300)
        })
        .catch(console.error)
    }
  }

  const handleBatchSelect = () => setBatch(isBatchEmpty ? { [experiments[0].uid]: true } : {})

  const handleBatchSelectAll = () =>
    setBatch(
      batchLength <= experiments.length
        ? experiments.reduce<Record<uuid, boolean>>((acc, d) => {
            acc[d.uid] = true

            return acc
          }, {})
        : {}
    )

  const handleBatchDelete = () =>
    handleSelect({
      title: i18n('experiments.deleteMulti', intl),
      description: i18n('experiments.deleteDesc', intl),
      handle: handleAction('archiveMulti'),
    })

  const onCheckboxChange = (uuid: uuid) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatch({
      ...batch,
      [uuid]: e.target.checked,
    })
  }

  const Row = ({ data, index, style }: RWListChildComponentProps) => (
    <Box display="flex" alignItems="center" mb={3} style={style}>
      {!isBatchEmpty && (
        <StyledCheckBox
          color="primary"
          checked={batch[data[index].uid] === true}
          onChange={onCheckboxChange(data[index].uid)}
          disableRipple
        />
      )}
      <Box flex={1}>
        <ObjectListItem data={data[index]} onSelect={onSelect} />
      </Box>
    </Box>
  )

  return (
    <>
      <Space direction="row" mb={6}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/experiments/new')}>
          {i18n('newE.title')}
        </Button>
        <Button
          variant="outlined"
          startIcon={isBatchEmpty ? <FilterListIcon /> : <CloseIcon />}
          onClick={handleBatchSelect}
          disabled={experiments.length === 0}
        >
          {i18n(`common.${isBatchEmpty ? 'batchOperation' : 'cancel'}`)}
        </Button>
        {!isBatchEmpty && (
          <>
            <Button variant="outlined" startIcon={<PlaylistAddCheckIcon />} onClick={handleBatchSelectAll}>
              {i18n('common.selectAll')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArchiveOutlinedIcon />}
              onClick={handleBatchDelete}
            >
              {i18n('archives.single')}
            </Button>
          </>
        )}
      </Space>

      {experiments.length > 0 &&
        Object.entries(_groupBy(experiments, 'kind')).map(([kind, experimentsByKind]) => (
          <Box key={kind} mb={6}>
            <Typography variant="overline">{transByKind(kind as any)}</Typography>
            <RWList
              width="100%"
              height={experimentsByKind.length > 3 ? 300 : experimentsByKind.length * 70}
              itemCount={experimentsByKind.length}
              itemSize={70}
              itemData={experimentsByKind}
            >
              {Row}
            </RWList>
          </Box>
        ))}

      {!loading && experiments.length === 0 && (
        <NotFound illustrated textAlign="center">
          <Typography>{i18n('experiments.notFound')}</Typography>
        </NotFound>
      )}

      {loading && <Loading />}
    </>
  )
}
