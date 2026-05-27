import pandas as pd

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import os

# =========================================
# PROCESS EXCEL FILE
# =========================================

def process_excel(file_path):

    # =========================================
    # READ EXCEL
    # =========================================

    df = pd.read_excel(file_path)

    print("Excel loaded successfully")

    # =========================================
    # BASIC INFO
    # =========================================

    rows, cols = df.shape

    columns = list(df.columns)

    print("Rows:", rows)
    print("Columns:", cols)

    # =========================================
    # GENERATE SUMMARY
    # =========================================

    summary = f"""
Excel Dataset Analysis

Total Rows: {rows}

Total Columns: {cols}

Column Names:
{", ".join(columns)}

First 5 Rows:

{df.head().to_string()}
"""

    # =========================================
    # CREATE CHARTS LIST
    # =========================================

    charts = []

    # =========================================
    # FIND NUMERIC COLUMNS
    # =========================================

    numeric_cols = df.select_dtypes(
        include=["number"]
    ).columns

    print("Numeric Columns:", numeric_cols)

    # =========================================
    # GENERATE MODERN CHARTS
    # =========================================

    for col in numeric_cols[:5]:

        try:

            plt.figure(
                figsize=(10, 5)
            )

            # =========================================
            # CLEAN BAR CHART
            # =========================================

            plt.bar(
                range(len(df[col])),
                df[col]
            )

            # =========================================
            # TITLES
            # =========================================

            plt.title(
                f"{col} Analysis",
                fontsize=18,
                pad=20,
            )

            plt.xlabel(
                "Records",
                fontsize=13,
            )

            plt.ylabel(
                col,
                fontsize=13,
            )

            # =========================================
            # GRID
            # =========================================

            plt.grid(
                alpha=0.25,
                linestyle="--",
            )

            # =========================================
            # FONT SIZES
            # =========================================

            plt.xticks(fontsize=10)

            plt.yticks(fontsize=10)

            # =========================================
            # LAYOUT
            # =========================================

            plt.tight_layout()

            # =========================================
            # SAVE CHART
            # =========================================

            chart_name = f"{col}_chart.png"

            charts_dir = os.path.join(
                os.getcwd(),
                "charts"
            )

            os.makedirs(
                charts_dir,
                exist_ok=True
            )

            chart_path = os.path.join(
                charts_dir,
                chart_name
            )

            plt.savefig(
                chart_path,
                bbox_inches="tight",
                dpi=200,
                facecolor="#ffffff"
            )

            print(
                "Chart path:",
                chart_path
            )

            print(
                "File exists:",
                os.path.exists(chart_path)
            )
            
            import time
            time.sleep(1)
            
            plt.close()

            # =========================================
            # CHART URL
            # =========================================

            chart_url = (
                f"https://insightiq-boi2.onrender.com/charts/{chart_name}"
            )

            charts.append(chart_url)

            print("Chart saved:", chart_url)

        except Exception as e:

            print(
                "Chart generation failed:",
                e
            )

    # =========================================
    # RETURN DATA
    # =========================================

    return {
        "summary": summary,
        "charts": charts,

        "stats": {
            "rows": rows,
            "columns": cols,
            "numeric_columns": len(numeric_cols),
            "charts_generated": len(charts),
        }
    }