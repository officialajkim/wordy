// eslint-disable-next-line
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
// import API
import {change_user_db} from './AdminAPI';
// Admin Components 
import SandboxSwitch from '../../admin_components/SandboxSwitch';
// utils
import {Props} from '../../utils';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Admin: React.FC<Props> = (props) => {
  const classes = useStyles();

  const lists = [
    {
      title: '실제결재모드 / 샌드박스 모드를 변환할게요',
      show: (
        <SandboxSwitch {... props}/>
      )
    },
    {
      title: '프로에서 베이직 계정으로 바꿔주세요',
      show: (
        <Button color="primary" onClick={() => change_user_db(props,'subscription', '')}>
          이 계정을 프로에서 베이직으로 바꾸기
        </Button>
      )
    },
    {
      title: '프로 구독중인 유저를 보여주세요',
      show: 'hi'
    },
    {
      title: '현재 총 가입된 유저를 보여주세요',
      show: 'bye  '
    }
  ]

  const accordions = lists.map(val => {
    return (
      <Accordion key={val.title}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{val.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {val.show}
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  })

  return (
    <div className={classes.root}>
      {accordions}
    </div>
  );
}

export default Admin;