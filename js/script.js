/*
Name: Mengly Lim
Course: COMP 4610 GUI I
Assignment: HW4 - Part 2: jQuery UI Sliders and Tabs
*/

$(document).ready(function () {
    let tabCount = 0;
    $("#tabs").tabs();

    function setupSlider(inputId, sliderId) {
        const $input = $("#" + inputId);
        const $slider = $("#" + sliderId);

        $slider.slider({
            min: -50,
            max: 50,
            value: 0,
            slide: function (event, ui) {
                $input.val(ui.value);
            }
        });

        $input.on("input", function () {
            const val = parseInt($(this).val()) || 0;
            $slider.slider("value", val);
        });
    }

    setupSlider("startCol", "startCol-slider");
    setupSlider("endCol", "endCol-slider");
    setupSlider("startRow", "startRow-slider");
    setupSlider("endRow", "endRow-slider");

    $("#mult-form").validate({
        rules: {
            startCol: { required: true, number: true, min: -50, max: 50 },
            endCol: { required: true, number: true, min: -50, max: 50 },
            startRow: { required: true, number: true, min: -50, max: 50 },
            endRow: { required: true, number: true, min: -50, max: 50 }
        },
        messages: {
            startCol: "Enter a number between -50 and 50",
            endCol: "Enter a number between -50 and 50",
            startRow: "Enter a number between -50 and 50",
            endRow: "Enter a number between -50 and 50"
        },
        submitHandler: function (form) {
            generateTable();
            return false;
        }
    });

    function generateTable() {
        const startCol = parseInt($("#startCol").val());
        const endCol = parseInt($("#endCol").val());
        const startRow = parseInt($("#startRow").val());
        const endRow = parseInt($("#endRow").val());

        if (startCol > endCol || startRow > endRow) {
            $("#error-message").text("Start values must be less than or equal to end values.");
            return;
        }

        $("#error-message").text("");

        let table = "<table><tr><th></th>";
        for (let col = startCol; col <= endCol; col++) {
            table += `<th>${col}</th>`;
        }
        table += "</tr>";

        for (let row = startRow; row <= endRow; row++) {
            table += `<tr><th>${row}</th>`;
            for (let col = startCol; col <= endCol; col++) {
                table += `<td>${row * col}</td>`;
            }
            table += "</tr>";
        }
        table += "</table>";

        tabCount++;
        const tabId = `tab-${tabCount}`;
        const tabTitle = `${startCol} to ${endCol}, ${startRow} to ${endRow}`;

        $("#tabs ul").append(`
            <li><a href="#${tabId}">${tabTitle}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>
        `);
        $("#tabs").append(`<div id="${tabId}">${table}</div>`);
        $("#tabs").tabs("refresh");
        const totalTabs = $("#tabs ul li").length;
        $("#tabs").tabs("option", "active", totalTabs - 1);
    }

    $("#tabs").on("click", "span.ui-icon-close", function () {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");
    });
});

function clearTable() {
    // Remove all tab headers and contents
    $("#tabs ul li").remove();
    $("#tabs > div").remove();
    $("#tabs").tabs("refresh");

    // Clear error message
    $("#error-message").text("");

    // Reset the form
    $("#mult-form")[0].reset();

    // Reset sliders and inputs to 0
    $("#startCol-slider, #endCol-slider, #startRow-slider, #endRow-slider").each(function () {
        $(this).slider("value", 0);
    });

    $("#startCol, #endCol, #startRow, #endRow").val(0);
}