class SelectOptions {

  get maintenanceIntervals() {
    const is = this.getSharedIntervals();
    is.find(i => i.value === 'past').label = 'Overdue';
    return is;
  }

  getSharedIntervals() {
    return [
      {
        value: 'past',
        label: 'Past',
        sql: {
          operator: '<',
          value: `NOW()`
        }
      },
      {
        value: '1m',
        label: 'Next 1 Month',
        sql: {
          operator: '<=',
          value: `NOW() + INTERVAL '1 month'`
        }
      },
      {
        value: '3m',
        label: 'Next 3 Months',
        sql: {
          operator: '<=',
          value: `NOW() + INTERVAL '3 months'`
        }
      },
      {
        value: '6m',
        label: 'Next 6 Months',
        sql: {
          operator: '<=',
          value: `NOW() + INTERVAL '6 months'`
        }
      },
      {
        value: '1y',
        label: 'Next 1 Year',
        sql: {
          operator: '<=',
          value: `NOW() + INTERVAL '1 year'`
        }
      },
      {
        value: '1yplus',
        label: 'Over 1 Year',
        sql: {
          operator: '>',
          value: `NOW() + INTERVAL '1 year'`
        }
      }
    ];
  }
}


export default new SelectOptions();
