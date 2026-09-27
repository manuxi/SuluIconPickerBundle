<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Tests\Unit\Pool;

use Manuxi\SuluIconPickerBundle\Model\IconReference;
use Manuxi\SuluIconPickerBundle\Pool\BootstrapIconsPool;
use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use PHPUnit\Framework\TestCase;

class IconPoolRegistryTest extends TestCase
{
    public function testFirstPoolIsDefault(): void
    {
        $registry = new IconPoolRegistry([new BootstrapIconsPool()]);

        $this->assertSame('bootstrap-icons', $registry->getDefaultKey());
        $this->assertTrue($registry->has('bootstrap-icons'));
        $this->assertFalse($registry->has('tabler'));
    }

    public function testDuplicatePoolKeyThrows(): void
    {
        $this->expectException(\LogicException::class);

        new IconPoolRegistry([new BootstrapIconsPool(), new BootstrapIconsPool()]);
    }

    public function testUnknownPoolThrows(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        (new IconPoolRegistry([new BootstrapIconsPool()]))->get('tabler');
    }

    public function testBootstrapIconsPoolReadsGeneratedNames(): void
    {
        $pool = new BootstrapIconsPool();

        $this->assertGreaterThan(1000, \count($pool->getIconNames()));
        $this->assertTrue($pool->hasIcon('calendar-heart'));
        $this->assertFalse($pool->hasIcon('does-not-exist'));
        $this->assertSame('bundles/suluiconpicker/icon-picker/bootstrap-icons/sprite.svg', $pool->getSpritePath());
    }

    /**
     * @dataProvider referenceProvider
     */
    public function testCreateReference(mixed $value, ?array $expected): void
    {
        $registry = new IconPoolRegistry([new BootstrapIconsPool()]);

        $this->assertSame($expected, $registry->createReference($value)?->toArray());
    }

    public static function referenceProvider(): iterable
    {
        yield 'stored value' => [['pool' => 'bootstrap-icons', 'name' => 'house'], ['pool' => 'bootstrap-icons', 'name' => 'house']];
        yield 'bare name uses default pool' => ['house', ['pool' => 'bootstrap-icons', 'name' => 'house']];
        yield 'pool:name string' => ['tabler:house', ['pool' => 'tabler', 'name' => 'house']];
        yield 'empty string' => ['', null];
        yield 'null' => [null, null];
        yield 'missing name' => [['pool' => 'bootstrap-icons'], null];
    }

    public function testIsValid(): void
    {
        $registry = new IconPoolRegistry([new BootstrapIconsPool()]);

        $this->assertTrue($registry->isValid(new IconReference('bootstrap-icons', 'house')));
        $this->assertFalse($registry->isValid(new IconReference('bootstrap-icons', 'does-not-exist')));
        $this->assertFalse($registry->isValid(new IconReference('tabler', 'house')));
    }
}
