(function () {
  const STORAGE_KEY = "pp_monthlyData";
  const LAST_MONTH_KEY = "pp_lastActiveMonth";

  function getMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function autoCloseMonthIfNeeded() {
    const nowMonth = getMonthKey();
    const lastMonth = localStorage.getItem(LAST_MONTH_KEY);

    if (!lastMonth) {
      localStorage.setItem(LAST_MONTH_KEY, nowMonth);
      return;
    }

    if (lastMonth !== nowMonth) {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

      if (!data[lastMonth]) {
        data[lastMonth] = {};
      }

      data[lastMonth].closed = true;
      data[lastMonth].closedAt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAST_MONTH_KEY, nowMonth);

      console.log("✅ Month auto-closed:", lastMonth);
    }
  }

  // Run immediately on page load
  autoCloseMonthIfNeeded();
})();
