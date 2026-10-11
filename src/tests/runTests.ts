// Test Runner Entrypoint for Terminal Verification
import { runAllBackendValidationTests } from './backendValidation';

async function main() {
  console.log('====================================================');
  console.log('MANGALSUTRA 2.0 — BACKEND VERIFICATION & TEST RUNNER');
  console.log('====================================================\n');

  const { total, passed, failed, results } = await runAllBackendValidationTests();

  results.forEach((r, idx) => {
    const symbol = r.passed ? '✓' : '✗';
    console.log(`[${symbol}] Test ${idx + 1}: [${r.suite}] ${r.testName}`);
    console.log(`    Evidence: ${r.evidence}\n`);
  });

  console.log('----------------------------------------------------');
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
