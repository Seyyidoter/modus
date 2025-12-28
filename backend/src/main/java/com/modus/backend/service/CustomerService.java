package com.modus.backend.service;

import com.modus.backend.domain.entity.Customer;
import com.modus.backend.domain.repository.CustomerRepository;
import com.modus.backend.dto.CustomerRequest;
import com.modus.backend.dto.CustomerResponse;
import com.modus.backend.exception.BusinessException;
import com.modus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CustomerResponse getCustomer(UUID id) {
        return customerRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (request.email() != null && !request.email().isEmpty() && customerRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already exists: " + request.email());
        }

        Customer customer = Customer.builder()
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .address(request.address())
                .taxId(request.taxId())
                .type(request.type())
                .build();

        return mapToResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse updateCustomer(UUID id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        if (request.email() != null && !request.email().equals(customer.getEmail()) && customerRepository.existsByEmail(request.email())) {
             throw new BusinessException("Email already exists: " + request.email());
        }

        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer.setTaxId(request.taxId());
        customer.setType(request.type());

        return mapToResponse(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getTaxId(),
                customer.getType(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}
