package com.modus.backend.controller;

import com.modus.backend.dto.ReportDTO;
import com.modus.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ReportDTO.DashboardData getDashboardData() {
        return reportService.getDashboardData();
    }
}
