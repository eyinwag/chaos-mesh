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

import { Box, Grid, Grow, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import { Event } from 'api/events.type'
import EventsChart from 'components/EventsChart'
import EventsTimeline from 'components/EventsTimeline'
import { Experiment } from 'api/experiments.type'
import Paper from '@ui/mui-extends/esm/Paper'
import PaperTop from '@ui/mui-extends/esm/PaperTop'
import Predefined from './Predefined'
import type { ReactChild } from 'react'
import { Schedule } from 'api/schedules.type'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import TotalStatus from './TotalStatus'
import { TourProvider } from '@reactour/tour'
import Welcome from './Welcome'
import { Workflow } from 'api/workflows.type'
import api from 'api'
import i18n from 'components/T'
import { useTheme } from '@mui/material/styles'

const NumPanel: React.FC<{ title: ReactChild; num: number; background: ReactChild }> = ({ title, num, background }) => (
  <Paper sx={{ overflow: 'hidden' }}>
    <PaperTop title={title} />
    <Box mt={6}>
      <Typography component="div" variant="h4">
        {num}
      </Typography>
    </Box>
    <Box position="absolute" bottom={-18} right={12}>
      {background}
    </Box>
  </Paper>
)

export default function Dashboard() {
  const [data, setData] = useState<{
    workflows: Workflow[]
    schedules: Schedule[]
    experiments: Experiment[]
    events: Event[]
  }>({
    workflows: [],
    schedules: [],
    experiments: [],
    events: [],
  })

  useEffect(() => {
    const fetchExperiments = api.experiments.experiments()
    const fetchSchedules = api.schedules.schedules()
    const fetchWorkflows = api.workflows.workflows()
    const fetchEvents = api.events.events({ limit: 216 })
    const fetchAll = () => {
      Promise.all([fetchSchedules, fetchWorkflows, fetchExperiments, fetchEvents])
        .then((data) =>
          setData({
            schedules: data[0].data,
            workflows: data[1].data,
            experiments: data[2].data,
            events: data[3].data,
          })
        )
        .catch(console.error)
    }

    fetchAll()

    const id = setInterval(fetchAll, 12000)

    return () => clearInterval(id)
  }, [])

  const theme = useTheme()
  const steps = [
    {
      selector: '.tutorial-dashboard',
      content: i18n('dashboard.tutorial.steps.dashboard'),
    },
    {
      selector: '.tutorial-workflows',
      content: i18n('dashboard.tutorial.steps.workflows'),
    },
    {
      selector: '.tutorial-schedules',
      content: i18n('dashboard.tutorial.steps.schedules'),
    },
    {
      selector: '.tutorial-experiments',
      content: i18n('dashboard.tutorial.steps.experiments'),
    },
    {
      selector: '.tutorial-events',
      content: i18n('dashboard.tutorial.steps.events'),
    },
    {
      selector: '.tutorial-archives',
      content: i18n('dashboard.tutorial.steps.archives'),
    },
    {
      selector: '.tutorial-newW',
      content: i18n('dashboard.tutorial.steps.newW'),
    },
    {
      selector: '.tutorial-newS',
      content: i18n('dashboard.tutorial.steps.newS'),
    },
    {
      selector: '.tutorial-newE',
      content: i18n('dashboard.tutorial.steps.newE'),
    },
    {
      selector: '.tutorial-search',
      content: i18n('dashboard.tutorial.steps.search'),
    },
    {
      selector: '.tutorial-namespace',
      content: i18n('dashboard.tutorial.steps.namespace'),
    },
    {
      selector: '.tutorial-predefined',
      content: i18n('dashboard.tutorial.steps.predefined'),
    },
    {
      selector: '.tutorial-end',
      content: i18n('dashboard.tutorial.steps.end'),
    },
  ]

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': theme.palette.primary.main,
          background: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
        }),
      }}
      prevButton={({ setCurrentStep }) => (
        <IconButton onClick={() => setCurrentStep((s) => s + 1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      )}
      nextButton={({ setCurrentStep }) => (
        <IconButton onClick={() => setCurrentStep((s) => s + 1)}>
          <ArrowForwardOutlinedIcon />
        </IconButton>
      )}
      showCloseButton={false}
    >
      <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
        <Grid container spacing={6}>
          <Grid container spacing={6} alignContent="flex-start" item xs={12} lg={8}>
            <Grid item xs={4}>
              <NumPanel
                title={i18n('experiments.title')}
                num={data.experiments.length}
                background={<ScienceOutlinedIcon color="primary" style={{ fontSize: '3em' }} />}
              />
            </Grid>
            <Grid item xs={4}>
              <NumPanel
                title={i18n('schedules.title')}
                num={data.schedules.length}
                background={<ScheduleIcon color="primary" style={{ fontSize: '3em' }} />}
              />
            </Grid>
            <Grid item xs={4}>
              <NumPanel
                title={i18n('workflows.title')}
                num={data.workflows.length}
                background={<AccountTreeOutlinedIcon color="primary" style={{ fontSize: '3em' }} />}
              />
            </Grid>
            <Grid item xs={12}>
              <Welcome />
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <PaperTop
                  title={i18n('dashboard.predefined')}
                  subtitle={i18n('dashboard.predefinedDesc')}
                  boxProps={{ mb: 3 }}
                />
                <Predefined />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <PaperTop title={i18n('common.timeline')} boxProps={{ mb: 3 }} />
                <EventsChart events={data.events} position="relative" height={300} />
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={6} item xs={12} lg={4}>
            <Grid item xs={12}>
              <Paper>
                <PaperTop title={i18n('dashboard.totalStatus')} boxProps={{ sx: { mb: 3 } }} />
                <TotalStatus position="relative" height={data.experiments.length > 0 ? 300 : '100%'} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <PaperTop title={i18n('dashboard.recent')} boxProps={{ mb: 3 }} />
                <EventsTimeline events={data.events.slice(0, 6)} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    </TourProvider>
  )
}
