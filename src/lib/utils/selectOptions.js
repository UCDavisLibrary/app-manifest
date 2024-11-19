class SelectOptions {

  get maintenanceIntervals() {
    const si = this.getSharedIntervals();
    si.find(i => i.value === 'past').label = 'Overdue';
    return si;
  }

  get sslExpirationIntervals() {
    const si = this.getSharedIntervals();
    si.find(i => i.value === 'past').label = 'Expired';
    si.find(i => i.value === 'never').label = 'Unknown';
    return si;
  }

  getSharedIntervals() {
    return [
      {
        value: '',
        label: 'All'
      },
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
      },
      {
        value: 'never',
        label: 'Never',
        sql: {
          operator: 'IS',
          value: 'NULL'
        }
      }
    ];
  }
}


export default new SelectOptions();
