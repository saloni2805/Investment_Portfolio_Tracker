document.addEventListener("DOMContentLoaded", () => {
  const investmentForm = document.getElementById("investment-form")
  const updateForm = document.getElementById("update-form")
  const investmentList = document.getElementById("investment-list")
  const totalValueElement = document.getElementById("total-value")
  const portfolioChartContainer = document.getElementById(
    "portfolio-chart-container"
  )
  const portfolioChartCanvas = document.getElementById("portfolio-chart")
  const addInvestmentBtn = document.getElementById("add-investment-btn")
  const addInvestmentForm = document.getElementById("add-investment-form")
  const updateInvestmentForm = document.getElementById("update-investment-form")

  let investments = JSON.parse(localStorage.getItem("investments")) || []
  let currentUpdateIndex = null
  let portfolioChartInstance = null // To track the chart instance

  function updateTotalValue() {
    const totalValue = investments.reduce(
      (total, investment) => total + investment.currentValue,
      0
    )
    totalValueElement.textContent = totalValue.toFixed(2)
  }

  function updateChart() {
    if (investments.length === 0) {
      portfolioChartContainer.style.display = "none"
      return
    }
    portfolioChartContainer.style.display = "block"

    const assetNames = investments.map((investment) => investment.assetName)
    const assetValues = investments.map((investment) => investment.currentValue)

    // Destroy the previous chart instance before creating a new one
    if (portfolioChartInstance) {
      portfolioChartInstance.destroy()
    }

    // Create a new chart instance
    portfolioChartInstance = new Chart(portfolioChartCanvas, {
      type: "pie",
      data: {
        labels: assetNames,
        datasets: [
          {
            data: assetValues,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#cc65fe",
              "#ffce56",
              "#2ecc71",
            ],
          },
        ],
      },
    })
  }

  function renderInvestments() {
    investmentList.innerHTML = ""
    investments.forEach((investment, index) => {
      const percentageChange = (
        ((investment.currentValue - investment.investmentAmount) /
          investment.investmentAmount) *
        100
      ).toFixed(2)
      const li = document.createElement("li")
      li.innerHTML = `<div class="asset-name">${investment.assetName} </div>
      <hr>
      <div> <span>Invested:</span>  Rs. ${investment.investmentAmount}   </div>
      <div><span>Current:</span>     Rs. ${investment.currentValue}  </div>       
        <div><span>Change:</span>    ${percentageChange}%</div> 
        <hr>     
                
                <div class="btns">  <button class="updatebtn" onclick="updateInvestment(${index})">Update</button>
                <button class="removebtn" onclick="removeInvestment(${index})">Remove</button></div>
              
            `
      investmentList.appendChild(li)
    })
    updateTotalValue()
    updateChart() // Always update the chart after rendering investments
  }

  investmentForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const assetName = document.getElementById("asset-name").value
    const investmentAmount = parseFloat(
      document.getElementById("investment-amount").value
    )
    const currentValue = parseFloat(
      document.getElementById("current-value").value
    )

    const newInvestment = { assetName, investmentAmount, currentValue }
    investments.push(newInvestment)
    localStorage.setItem("investments", JSON.stringify(investments))
    renderInvestments()

    // Reset the form after submission
    investmentForm.reset()
    closeForm("add-investment-form") // Close form after adding the investment
  })

  updateForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const currentValue = parseFloat(
      document.getElementById("update-current-value").value
    )
    investments[currentUpdateIndex].currentValue = currentValue
    localStorage.setItem("investments", JSON.stringify(investments))
    renderInvestments()
    closeForm("update-investment-form") // Close the form
  })

  window.updateInvestment = (index) => {
    currentUpdateIndex = index
    const investment = investments[index]
    document.getElementById("update-asset-name").value = investment.assetName
    document.getElementById("update-investment-amount").value =
      investment.investmentAmount
    document.getElementById("update-current-value").value =
      investment.currentValue
    updateInvestmentForm.classList.add("active")
  }

  window.removeInvestment = (index) => {
    investments.splice(index, 1)
    localStorage.setItem("investments", JSON.stringify(investments))
    renderInvestments()
  }

  addInvestmentBtn.addEventListener("click", () => {
    addInvestmentForm.classList.add("active")
  })

  window.closeForm = (formId) => {
    document.getElementById(formId).classList.remove("active")
    // Reset form when closed
    if (formId === "add-investment-form") {
      investmentForm.reset()
    }
  }

  renderInvestments()
})
