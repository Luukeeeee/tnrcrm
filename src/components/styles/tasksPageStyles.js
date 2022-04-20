// eslint-disable-next-line import/no-anonymous-default-export
export default {
  titleCell: {
    backgroundColor: 'rgb(25, 118, 211)',
    p: 1,
    color: 'white'
  },
  titleCellUrgent: {
    backgroundColor: 'red',
    p: 1,
    color: 'white'
  },
  textCell: { display: 'flex', justifyContent: 'space-around', mt: 1 },
  taskCheckBox: { position: 'relative', bottom: 7 },
  checkBox: { display: 'flex', justifyContent: 'center' },
  taskRow: {
    mt: 2,
    ':hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.24) 0px 3px 8px'
    }
  }
};
